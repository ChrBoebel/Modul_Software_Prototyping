const ProductDataSection = ({ productData }) => (
  <div className="section-content">
    <div className="data-grid">
      <div className="data-row">
        <span className="label">Produktinteresse:</span>
        <span className="value">{productData.interest || '—'}</span>
      </div>
      {productData.dachflaeche && (
        <div className="data-row">
          <span className="label">Dachfläche:</span>
          <span className="value">{productData.dachflaeche}</span>
        </div>
      )}
      {productData.ausrichtung && (
        <div className="data-row">
          <span className="label">Ausrichtung:</span>
          <span className="value">{productData.ausrichtung}</span>
        </div>
      )}
      {productData.stromverbrauch && (
        <div className="data-row">
          <span className="label">Stromverbrauch:</span>
          <span className="value">{productData.stromverbrauch}</span>
        </div>
      )}
      {productData.eigentuemer && (
        <div className="data-row">
          <span className="label">Eigentümer:</span>
          <span className="value">{productData.eigentuemer}</span>
        </div>
      )}
      {productData.budget && (
        <div className="data-row">
          <span className="label">Budget:</span>
          <span className="value">{productData.budget}</span>
        </div>
      )}
      {productData.timeframe && (
        <div className="data-row">
          <span className="label">Zeitrahmen:</span>
          <span className="value">{productData.timeframe}</span>
        </div>
      )}
    </div>
  </div>
);

export default ProductDataSection;
