// UI base: botões, campos, cabeçalho, chips e seções · API: nenhuma
import { Children, cloneElement, isValidElement, useId } from "react";
import { Camera, Search, SlidersHorizontal } from "lucide-react";
import { colors, fontBody, gradientKira } from "../theme";
import { Button, Card, Chip, ListRow, ScreenHeader, Text } from "./primitives";

export const inputStyle = (hasError) => ({
  width: "100%",
  padding: "var(--space-13) var(--space-15)",
  borderRadius: "var(--radius-lg)",
  background: colors.muted,
  color: colors.foreground,
  fontFamily: fontBody,
  fontSize: "var(--font-size-md)",
  border: `1px solid ${hasError ? colors.destructive : colors.border}`,
  boxSizing: "border-box",
  colorScheme: "light",
});

// Liga o rótulo ao campo (id, aria-invalid e aria-describedby) sem mudar o markup das telas
const FORM_CONTROLS = ["input", "select", "textarea"];
const wireControl = (node, props) => {
  if (!isValidElement(node)) return node;
  if (FORM_CONTROLS.includes(node.type)) return cloneElement(node, { ...props, ...node.props });
  if (node.props.children)
    return cloneElement(
      node,
      undefined,
      Children.map(node.props.children, (c) => wireControl(c, props)),
    );
  return node;
};

export const Field = ({ label, error, children }) => {
  const id = useId();
  const errorId = `${id}-erro`;
  const control = wireControl(children, {
    id,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
  });
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)", marginBottom: "var(--space-14)" }}>
      <label
        htmlFor={id}
        style={{ fontSize: "var(--font-size-xs)", fontWeight: 500, color: colors.foreground, fontFamily: fontBody }}
      >
        {label}
      </label>
      {control}
      {error && (
        <p
          id={errorId}
          role="alert"
          style={{ fontSize: "var(--font-size-xs)", color: colors.destructiveText, fontFamily: fontBody, margin: 0 }}
        >
          {error}
        </p>
      )}
    </div>
  );
};

// sticky: em formulários longos mantém a ação principal visível no rodapé da área rolável
export const PrimaryButton = ({ children, onClick, disabled, pill, type = "button", sticky }) => {
  const button = (
    <Button
      type={type}
      disabled={disabled}
      onClick={onClick}
      radius={pill ? "pill" : "2xl"}
      style={{ marginTop: sticky ? 0 : "var(--space-4)" }}
    >
      {children}
    </Button>
  );
  if (!sticky) return button;
  return (
    <div
      style={{
        position: "sticky",
        bottom: "calc(-1 * var(--space-32))",
        zIndex: 1,
        padding: "var(--space-16) 0 var(--space-12)",
        background: `linear-gradient(to top, ${colors.background} 75%, transparent)`,
      }}
    >
      {button}
    </div>
  );
};

export const SecondaryButton = ({ children, onClick }) => (
  <Button
    variant="secondary"
    radius="lg"
    pad={12}
    size="sm"
    onClick={onClick}
    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-6)" }}
  >
    {children}
  </Button>
);

export const DocUploadBox = ({ label, value, error, inputRef, onChange }) => (
  <div style={{ marginBottom: "var(--space-14)" }}>
    <label
      style={{
        fontSize: "var(--font-size-xs)",
        fontWeight: 500,
        color: colors.foreground,
        fontFamily: fontBody,
        display: "block",
        marginBottom: "var(--space-6)",
      }}
    >
      {label}
    </label>
    <button
      type="button"
      className="k-reset"
      onClick={() => inputRef.current?.click()}
      style={{
        boxSizing: "content-box",
        width: "100%",
        aspectRatio: "16/10",
        borderRadius: "var(--radius-2xl)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "var(--space-6)",
        border: `2px ${value ? "solid" : "dashed"} ${error ? colors.destructive : value ? colors.primary : colors.border}`,
        background: colors.muted,
        cursor: "pointer",
      }}
    >
      {value ? (
        <img src={value} alt={label} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <>
          <Camera size={26} color={colors.mutedForeground} />
          <span style={{ fontSize: "var(--font-size-xs)", color: colors.mutedForeground, fontFamily: fontBody }}>
            Toque para enviar
          </span>
        </>
      )}
    </button>
    <input
      ref={inputRef}
      type="file"
      accept="image/*"
      style={{ display: "none" }}
      onChange={(e) => onChange(e.target.files?.[0])}
    />
    {error && (
      <p
        style={{
          fontSize: "var(--font-size-xs)",
          color: colors.destructiveText,
          fontFamily: fontBody,
          margin: "var(--space-4) 0 0",
        }}
      >
        {error}
      </p>
    )}
  </div>
);

export const Header = ({ onBack }) => <ScreenHeader onBack={onBack} />;

export const StepDots = ({ total, done }) => (
  <div style={{ display: "flex", gap: "var(--space-3)", padding: "0 var(--space-22) var(--space-4)" }}>
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        style={{
          height: 3,
          flex: 1,
          borderRadius: "var(--radius-2xs)",
          background: i < done ? colors.primary : colors.border,
        }}
      />
    ))}
  </div>
);

export const SearchBar = ({ value, onChange, onFilterClick }) => (
  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-10)" }}>
    <div
      style={{
        flex: 1,
        minWidth: 0,
        display: "flex",
        alignItems: "center",
        gap: "var(--space-10)",
        background: colors.muted,
        borderRadius: "var(--radius-pill)",
        padding: "var(--space-12) var(--space-16)",
      }}
    >
      <Search size={16} color={colors.mutedForeground} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar profissionais..."
        style={{
          flex: 1,
          minWidth: 0,
          border: "none",
          outline: "none",
          background: "transparent",
          fontFamily: fontBody,
          fontSize: "var(--font-size-sm)",
          color: colors.foreground,
        }}
      />
    </div>
    <button
      onClick={onFilterClick}
      aria-label="Filtros"
      style={{
        width: 46,
        height: 46,
        borderRadius: "var(--radius-2xl)",
        border: "none",
        background: gradientKira,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      <SlidersHorizontal size={18} color={colors.primaryForeground} />
    </button>
  </div>
);

export const CategoryChip = ({ label, active, onClick }) => (
  <Chip active={active} onClick={onClick}>
    {label}
  </Chip>
);

export const ProfileSection = ({ title, children }) => (
  <div style={{ marginBottom: "var(--space-22)" }}>
    <Text
      size="xs"
      weight={700}
      color={colors.mutedForeground}
      style={{ letterSpacing: "0.06em", textTransform: "uppercase", margin: "0 0 var(--space-8)" }}
    >
      {title}
    </Text>
    <Card>{children}</Card>
  </div>
);

export const ProfileMenuRow = ListRow;
