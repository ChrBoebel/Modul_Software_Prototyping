import { Tooltip } from '../Tooltip';

/**
 * Toolbar Button with Tooltip
 */
const ToolbarButton = ({
    icon: Icon,
    tooltip,
    onClick,
    active = false,
    disabled = false,
    variant = 'default' // 'default', 'success', 'danger'
}) => {
    const variantClasses = {
        default: active ? 'bg-primary text-white' : '',
        success: 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200',
        danger: 'bg-red-100 text-red-600 hover:bg-red-200'
    };

    return (
        <Tooltip content={tooltip} position="left">
            <button
                className={`map-control-btn ${variantClasses[variant]} ${active ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                onClick={onClick}
                disabled={disabled}
                style={{ opacity: disabled ? 0.5 : 1 }}
                aria-label={tooltip}
            >
                <Icon size={18} />
            </button>
        </Tooltip>
    );
};

export default ToolbarButton;
