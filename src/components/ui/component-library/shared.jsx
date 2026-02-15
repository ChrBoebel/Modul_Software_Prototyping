export const ComponentSection = ({ title, description, children }) => (
  <section className="component-section">
    <h2>{title}</h2>
    <p className="section-description">{description}</p>
    {children}
  </section>
);

export const ComponentShowcase = ({ title, children, code }) => (
  <div className="component-showcase">
    <h3>{title}</h3>
    <div className="showcase-preview">
      {children}
    </div>
    <div className="showcase-code">
      <pre><code>{code}</code></pre>
    </div>
  </div>
);
