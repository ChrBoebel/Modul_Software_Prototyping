export const SectionHeader = ({ title, icon: Icon }) => {
  return (
    <div className="section-header">
      {Icon && <Icon className="section-header-icon" size={24} />}
      <h2 className="h2">{title}</h2>
    </div>
  );
};
