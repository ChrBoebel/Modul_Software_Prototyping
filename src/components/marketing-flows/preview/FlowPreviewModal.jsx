import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, RotateCcw, X, CheckCircle, ExternalLink, MapPin } from 'lucide-react';
import { getAvailabilityForAddress } from '../../produkt-mapping/availabilityLogic';
import { useLocalStorage } from '../../../hooks/useLocalStorage';

const FlowPreviewModal = ({
  isOpen,
  onClose,
  nodes,
  cardsById,
  campaignName,
  campaignId,
  startNodeId,
  onLeadCreated,
  onNavigateToLead
}) => {
  const nodeMap = useMemo(() => new Map(nodes.map(node => [node.id, node])), [nodes]);
  const getNode = useCallback((id) => nodeMap.get(id), [nodeMap]);
  const rootNode = useMemo(() => nodes.find(n => n.type === 'start'), [nodes]);

  const effectiveStartId = startNodeId || rootNode?.id || null;
  const [currentNodeId, setCurrentNodeId] = useState(effectiveStartId);
  const [history, setHistory] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [collectedAnswers, setCollectedAnswers] = useState([]);
  const [leadCreated, setLeadCreated] = useState(false);
  const [createdLeadId, setCreatedLeadId] = useState(null);

  // Load product mapping data from localStorage
  const [products] = useLocalStorage('swk:productCatalog', []);
  const [rules] = useLocalStorage('swk:availabilityRules', []);

  const questionCount = useMemo(
    () => nodes.filter(n => n.type === 'question').length,
    [nodes]
  );

  const currentNode = currentNodeId ? getNode(currentNodeId) : null;
  const currentCard = currentNode?.cardId ? cardsById[currentNode.cardId] : null;
  const inputType = currentCard?.inputType || 'Single-Choice';
  const answers = currentCard?.answers || [];

  // Reset preview when opened or when root changes.
  useEffect(() => {
    if (!isOpen) return;
    setCurrentNodeId(effectiveStartId);
    setHistory([]);
    setSelectedAnswers([]);
    setInputValue('');
    setIsComplete(false);
    setCollectedAnswers([]);
    setLeadCreated(false);
    setCreatedLeadId(null);
  }, [isOpen, effectiveStartId]);

  // Calculate total score from collected answers
  const totalScore = useMemo(() => {
    return collectedAnswers.reduce((sum, a) => sum + (a.score || 0), 0);
  }, [collectedAnswers]);

  // Detect contact data from answers (email/phone)
  const extractedContact = useMemo(() => {
    const contactAnswer = collectedAnswers.find(a =>
      a.inputType === 'Eingabe' &&
      (a.question?.toLowerCase().includes('kontakt') ||
       a.question?.toLowerCase().includes('e-mail') ||
       a.question?.toLowerCase().includes('telefon'))
    );
    return contactAnswer?.answer || '';
  }, [collectedAnswers]);

  // Detect address from answers and check availability
  const addressAvailability = useMemo(() => {
    // Find answers that look like address fields
    const addressAnswers = collectedAnswers.filter(a =>
      a.inputType === 'Eingabe' && (
        a.question?.toLowerCase().includes('adresse') ||
        a.question?.toLowerCase().includes('straße') ||
        a.question?.toLowerCase().includes('strasse') ||
        a.question?.toLowerCase().includes('plz') ||
        a.question?.toLowerCase().includes('postleitzahl') ||
        a.question?.toLowerCase().includes('ort') ||
        a.question?.toLowerCase().includes('stadt')
      )
    );

    if (addressAnswers.length === 0) return null;

    // Try to extract address components
    let postalCode = '';
    let city = '';
    let street = '';
    let houseNumber = '';

    for (const ans of addressAnswers) {
      const q = ans.question?.toLowerCase() || '';
      const v = ans.answer?.trim() || '';

      if (q.includes('plz') || q.includes('postleitzahl')) {
        postalCode = v;
      } else if (q.includes('ort') || q.includes('stadt')) {
        city = v;
      } else if (q.includes('straße') || q.includes('strasse')) {
        // Try to extract street and house number
        const match = v.match(/^(.+?)\s+(\d+\s*\w*)$/);
        if (match) {
          street = match[1];
          houseNumber = match[2];
        } else {
          street = v;
        }
      } else if (q.includes('adresse')) {
        // Full address - try to parse
        const parts = v.split(',').map(p => p.trim());
        if (parts.length >= 2) {
          // First part: street + number, second part: PLZ + city
          const streetMatch = parts[0].match(/^(.+?)\s+(\d+\s*\w*)$/);
          if (streetMatch) {
            street = streetMatch[1];
            houseNumber = streetMatch[2];
          } else {
            street = parts[0];
          }
          const plzCityMatch = parts[1].match(/^(\d{5})\s+(.+)$/);
          if (plzCityMatch) {
            postalCode = plzCityMatch[1];
            city = plzCityMatch[2];
          }
        }
      }
    }

    // If we have at least a postal code or street, check availability
    if (!postalCode && !street) return null;

    const address = { postalCode, city, street, houseNumber };

    try {
      const result = getAvailabilityForAddress(address, { products, rules });
      return {
        address,
        ...result
      };
    } catch (e) {
      console.warn('Availability check failed:', e);
      return null;
    }
  }, [collectedAnswers, products, rules]);

  // Detect product interest from answers
  const detectedProduct = useMemo(() => {
    const productAnswer = collectedAnswers.find(a =>
      a.question?.toLowerCase().includes('interessier') ||
      a.question?.toLowerCase().includes('produkt') ||
      a.question?.toLowerCase().includes('thema')
    );
    if (!productAnswer) return null;

    const answer = productAnswer.answer?.toLowerCase() || '';
    if (answer.includes('solar') || answer.includes('photovoltaik') || answer.includes('pv')) return 'solar';
    if (answer.includes('wärmepumpe') || answer.includes('heiz')) return 'heatpump';
    if (answer.includes('strom') || answer.includes('tarif')) return 'energy_contract';
    if (answer.includes('wallbox') || answer.includes('e-mobil') || answer.includes('laden')) return 'charging_station';
    if (answer.includes('speicher')) return 'energy_storage';
    return null;
  }, [collectedAnswers]);

  const visitedQuestionCount = useMemo(() => {
    const historyQuestions = history.filter(id => getNode(id)?.type === 'question').length;
    return historyQuestions + (currentNode?.type === 'question' ? 1 : 0);
  }, [history, currentNode, getNode]);

  const progressRatio = questionCount > 0
    ? Math.min(visitedQuestionCount / questionCount, 1)
    : 0;

  const goToNode = useCallback((nextId, options = {}) => {
    const { recordHistory = true } = options;
    if (recordHistory && currentNodeId) {
      setHistory(prev => [...prev, currentNodeId]);
    }
    setCurrentNodeId(nextId);
    setSelectedAnswers([]);
    setInputValue('');
  }, [currentNodeId]);

  const handleRestart = () => {
    setCurrentNodeId(effectiveStartId);
    setHistory([]);
    setSelectedAnswers([]);
    setInputValue('');
    setIsComplete(false);
    setCollectedAnswers([]);
    setLeadCreated(false);
    setCreatedLeadId(null);
  };

  // Create a lead from collected flow data
  const handleCreateLead = useCallback(() => {
    if (!onLeadCreated || leadCreated) return;

    // Generate new lead ID
    const timestamp = new Date().toISOString();
    const leadNumber = `LEAD-${new Date().getFullYear()}-${String(Date.now()).slice(-4)}`;

    // Parse contact info (try to detect email vs phone)
    let email = '';
    let phone = '';
    const contact = extractedContact.trim();
    if (contact.includes('@')) {
      email = contact;
    } else if (contact.match(/[\d\s+\-()]/)) {
      phone = contact;
    }

    // Calculate normalized score (0-100 scale)
    // Base score: 50, plus collected scores
    const normalizedScore = Math.min(100, Math.max(0, 50 + totalScore * 5));

    // Format address from availability check
    const formattedAddress = addressAvailability?.address
      ? [
          addressAvailability.address.street,
          addressAvailability.address.houseNumber,
          addressAvailability.address.postalCode,
          addressAvailability.address.city
        ].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim()
      : '';

    const newLead = {
      id: Date.now(),
      leadNumber,
      timestamp,
      source: campaignName || 'Flow',
      status: 'new',
      priority: normalizedScore >= 80 ? 'high' : normalizedScore >= 50 ? 'medium' : 'low',
      customer: {
        firstName: '',
        lastName: '',
        email,
        phone,
        address: formattedAddress,
        customerType: 'private'
      },
      interest: {
        type: detectedProduct || 'energy_contract',
        details: collectedAnswers.map(a => `${a.question}: ${a.answer}`).join(' | '),
        budgetRange: '',
        timeframe: ''
      },
      qualification: {
        score: normalizedScore,
        flowAnswers: collectedAnswers
      },
      // Include availability data in lead
      availability: addressAvailability ? {
        isServiceable: addressAvailability.isServiceable,
        availableProducts: addressAvailability.availableProducts.map(p => ({
          id: p.id,
          name: p.name
        })),
        checkedAddress: addressAvailability.address
      } : null,
      flowId: campaignId || 'default',
      assignedTo: '',
      notes: `Lead generiert durch Flow: ${campaignName || 'Unbekannt'}`,
      nextAction: 'Erstkontakt aufnehmen',
      nextActionDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };

    onLeadCreated(newLead);
    setLeadCreated(true);
    setCreatedLeadId(newLead.id);
  }, [onLeadCreated, leadCreated, extractedContact, totalScore, collectedAnswers, campaignName, campaignId, detectedProduct, addressAvailability]);

  const handleBack = () => {
    setHistory(prev => {
      if (prev.length === 0) return prev;
      const newHistory = [...prev];
      const last = newHistory.pop();
      setCurrentNodeId(last);
      setSelectedAnswers([]);
      setInputValue('');
      setIsComplete(false);
      return newHistory;
    });
  };

  const toggleAnswer = (index) => {
    if (inputType === 'Multi-Choice') {
      setSelectedAnswers(prev => (
        prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
      ));
      return;
    }
    setSelectedAnswers([index]);
  };

  const canContinue = useMemo(() => {
    if (!currentNode || currentNode.type !== 'question') return false;
    if (inputType === 'Eingabe' || inputType === 'Range-Slider') {
      return inputValue.toString().trim().length > 0;
    }
    if (answers.length === 0) return true;
    if (inputType === 'Multi-Choice') return selectedAnswers.length > 0;
    return selectedAnswers.length === 1;
  }, [currentNode, inputType, inputValue, selectedAnswers, answers.length]);

  const handleNext = () => {
    if (!currentNode) return;

    // Collect answer data before moving to next node
    if (currentNode.type === 'question' && currentCard) {
      let answerText = '';
      let answerScore = 0;

      if (inputType === 'Eingabe' || inputType === 'Range-Slider') {
        answerText = inputValue.toString();
        // Input fields typically don't have scores
      } else if (selectedAnswers.length > 0) {
        const selectedIndices = selectedAnswers;
        const selectedTexts = selectedIndices.map(idx => {
          const ans = answers[idx];
          return typeof ans === 'object' ? ans.text : ans;
        });
        answerText = selectedTexts.join(', ');

        // Sum up scores from selected answers
        answerScore = selectedIndices.reduce((sum, idx) => {
          const ans = answers[idx];
          const score = typeof ans === 'object' ? (ans.score || 0) : 0;
          return sum + score;
        }, 0);
      }

      setCollectedAnswers(prev => [...prev, {
        nodeId: currentNode.id,
        cardId: currentNode.cardId,
        question: currentCard.title || currentNode.label,
        answer: answerText,
        score: answerScore,
        inputType: inputType
      }]);
    }

    const children = currentNode.children || [];
    if (children.length === 0) {
      setIsComplete(true);
      return;
    }

    let nextId = children[0];
    if (children.length > 1) {
      const answerIndex = selectedAnswers[0] ?? 0;
      nextId = children[answerIndex] || children[0];
    }

    goToNode(nextId);
  };

  // Auto-skip internal nodes (start/module) that have a single child.
  useEffect(() => {
    if (!isOpen || !currentNodeId) return;
    let node = getNode(currentNodeId);
    let nextId = currentNodeId;
    let safety = 0;

    while (
      node &&
      (node.type === 'module' || node.type === 'start') &&
      (node.children?.length || 0) === 1 &&
      safety < 10
    ) {
      nextId = node.children[0];
      node = getNode(nextId);
      safety += 1;
    }

    if (nextId !== currentNodeId) {
      goToNode(nextId, { recordHistory: false });
    }
  }, [currentNodeId, getNode, goToNode, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="flow-preview-overlay" role="dialog" aria-modal="true" aria-label="Flow Preview">
      <div className="flow-preview-modal">
        <div className="flow-preview-header">
          <div className="flow-preview-title">
            <h3>{campaignName || 'Flow Preview'}</h3>
            {!isComplete && (
              <>
                <span className="flow-preview-progress">
                  {visitedQuestionCount}/{questionCount} Schritte
                </span>
                <div className="flow-preview-progress-bar" aria-hidden="true">
                  <div
                    className="flow-preview-progress-bar-fill"
                    style={{ width: `${progressRatio * 100}%` }}
                  />
                </div>
              </>
            )}
          </div>

          <button type="button" className="btn-icon" onClick={onClose} aria-label="Preview schließen">
            <X size={16} />
          </button>
        </div>

        <div className="flow-preview-body">
          <div
            key={isComplete ? 'complete' : (currentNodeId || 'empty')}
            className="flow-preview-step"
          >
            {isComplete && (
            <div className="flow-preview-end">
              {leadCreated ? (
                <>
                  <div className="flow-preview-success">
                    <CheckCircle size={48} className="text-green-500" />
                  </div>
                  <h4>Lead erfolgreich erstellt!</h4>
                  <p>Der Lead wurde mit Score {Math.min(100, Math.max(0, 50 + totalScore * 5))} angelegt.</p>
                </>
              ) : (
                <>
                  <h4>Flow beendet</h4>
                  <p>Alle Schritte wurden durchlaufen.</p>

                  {/* Summary of collected data */}
                  <div className="flow-preview-summary">
                    <div className="summary-item">
                      <span className="summary-label">Gesammelter Score:</span>
                      <span className="summary-value">{totalScore} Punkte → Lead-Score: {Math.min(100, Math.max(0, 50 + totalScore * 5))}</span>
                    </div>
                    {detectedProduct && (
                      <div className="summary-item">
                        <span className="summary-label">Erkanntes Produkt:</span>
                        <span className="summary-value">
                          {detectedProduct === 'solar' && 'Solar PV'}
                          {detectedProduct === 'heatpump' && 'Wärmepumpe'}
                          {detectedProduct === 'energy_contract' && 'Stromtarif'}
                          {detectedProduct === 'charging_station' && 'E-Mobilität'}
                          {detectedProduct === 'energy_storage' && 'Speicher'}
                        </span>
                      </div>
                    )}
                    {extractedContact && (
                      <div className="summary-item">
                        <span className="summary-label">Kontakt:</span>
                        <span className="summary-value">{extractedContact}</span>
                      </div>
                    )}
                    <div className="summary-item">
                      <span className="summary-label">Beantwortete Fragen:</span>
                      <span className="summary-value">{collectedAnswers.length}</span>
                    </div>
                    {addressAvailability && (
                      <div className="summary-item">
                        <span className="summary-label">
                          <MapPin size={14} style={{ display: 'inline', marginRight: '4px' }} />
                          Verfügbare Produkte:
                        </span>
                        <span className="summary-value">
                          {addressAvailability.isServiceable ? (
                            <span className="availability-badges">
                              {addressAvailability.availableProducts.map(p => (
                                <span key={p.id} className="badge success" style={{ marginRight: '4px' }}>
                                  {p.name}
                                </span>
                              ))}
                            </span>
                          ) : (
                            <span className="badge warning">Keine Produkte an dieser Adresse</span>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}

            {!isComplete && !currentNode && (
            <div className="flow-preview-empty">
              <p>Kein Flow vorhanden.</p>
            </div>
          )}

            {!isComplete && currentNode && (currentNode.type === 'module' || currentNode.type === 'start') && (currentNode.children?.length || 0) > 1 && (
            <div className="flow-preview-branch">
              <h4>{currentNode.label}</h4>
              <p>Wähle den nächsten Pfad:</p>
              <div className="flow-preview-answers">
                {currentNode.children.map((childId) => {
                  const child = getNode(childId);
                  return (
                    <button
                      key={childId}
                      type="button"
                      className="flow-preview-answer single"
                      onClick={() => goToNode(childId)}
                    >
                      {child?.label || childId}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

            {!isComplete && currentNode && currentNode.type === 'question' && (
            <div className="flow-preview-question-card">
              <h4 className="flow-preview-question">
                {currentCard?.title || currentNode.label}
              </h4>

              {currentCard?.description && (
                <p className="flow-preview-description">{currentCard.description}</p>
              )}

              {(inputType === 'Eingabe') && (
                <input
                  type="text"
                  className="flow-preview-input"
                  placeholder="Deine Antwort..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              )}

              {(inputType === 'Range-Slider') && (
                <div className="flow-preview-range">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={inputValue || 5}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <div className="flow-preview-range-value">{inputValue || 5}</div>
                </div>
              )}

              {inputType !== 'Eingabe' && inputType !== 'Range-Slider' && (
                <>
                  {answers.length === 0 && (
                    <p className="flow-preview-hint">
                      Keine Antwortoptionen definiert – der Preview springt mit „Weiter“ fort.
                    </p>
                  )}

                  {answers.length > 0 && inputType === 'Dropdown' && (
                    <select
                      className="flow-preview-select"
                      value={selectedAnswers[0] ?? ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          setSelectedAnswers([]);
                          return;
                        }
                        setSelectedAnswers([Number(value)]);
                      }}
                      aria-label="Auswahl"
                    >
                      <option value="">Bitte auswählen…</option>
                      {answers.map((answer, index) => (
                        <option key={index} value={index}>{answer}</option>
                      ))}
                    </select>
                  )}

                  {answers.length > 0 && inputType !== 'Dropdown' && (
                    <div
                      className="flow-preview-answers"
                      role={inputType === 'Multi-Choice' ? 'group' : 'radiogroup'}
                      aria-label="Antwortoptionen"
                    >
                      {answers.map((answer, index) => {
                        const isSelected = selectedAnswers.includes(index);
                        return (
                          <button
                            key={index}
                            type="button"
                            className={`flow-preview-answer ${inputType === 'Multi-Choice' ? 'multi' : 'single'} ${isSelected ? 'selected' : ''}`}
                            onClick={() => toggleAnswer(index)}
                            aria-pressed={isSelected}
                          >
                            {answer}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
          </div>
        </div>

        <div className="flow-preview-footer">
          {!isComplete && history.length > 0 && (
            <button type="button" className="btn btn-secondary" onClick={handleBack}>
              <ArrowLeft size={14} />
              Zurück
            </button>
          )}

          {!isComplete && currentNode?.type === 'question' && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleNext}
              disabled={!canContinue}
            >
              Weiter
            </button>
          )}

          {isComplete && !leadCreated && (
            <>
              <button type="button" className="btn btn-secondary" onClick={handleRestart}>
                <RotateCcw size={14} />
                Neu starten
              </button>
              {onLeadCreated && (
                <button type="button" className="btn btn-primary" onClick={handleCreateLead}>
                  <CheckCircle size={14} />
                  Lead erstellen
                </button>
              )}
            </>
          )}

          {isComplete && leadCreated && (
            <>
              <button type="button" className="btn btn-secondary" onClick={handleRestart}>
                <RotateCcw size={14} />
                Weiteren Lead
              </button>
              {onNavigateToLead && createdLeadId && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => {
                    onNavigateToLead(createdLeadId);
                    onClose();
                  }}
                >
                  <ExternalLink size={14} />
                  Lead ansehen
                </button>
              )}
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Schließen
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlowPreviewModal;
