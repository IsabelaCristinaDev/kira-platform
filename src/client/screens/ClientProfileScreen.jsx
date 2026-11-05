// Menu do perfil do cliente · API: kira-backend (logout)
import { LogOut, User } from "lucide-react";
import { useSignup } from "../../context/SignupContext";
import { useSession } from "../../context/SessionContext";
import { ProfileMenuRow, ProfileSection } from "../../shared/components/ui";
import { colors, fontBody, fontDisplay, gradientKira } from "../../shared/theme";
import { BottomNav } from "../components/BottomNav";
import { clientProfileMenu } from "../data/options";

// ---------- Perfil da cliente ----------
export default function ClientProfileScreen() {
  const { cForm } = useSignup();
  const { goToTab, logout, setScreen } = useSession();
  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, background: colors.background }}>
      <div
        style={{
          background: gradientKira,
          padding: "var(--space-28) var(--space-24) var(--space-24)",
          display: "flex",
          alignItems: "center",
          gap: "var(--space-14)",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "var(--radius-round)",
            overflow: "hidden",
            border: "3px solid hsl(var(--white-hsl) / 0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "hsl(var(--white-hsl) / 0.2)",
            flexShrink: 0,
          }}
        >
          {cForm.photo ? (
            <img src={cForm.photo} alt="Foto de perfil" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <User size={28} color={colors.primaryForeground} />
          )}
        </div>
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              fontFamily: fontDisplay,
              fontWeight: 700,
              fontSize: "var(--font-size-lg)",
              color: colors.primaryForeground,
              margin: 0,
            }}
          >
            {cForm.name || "Cliente Kira"}
          </p>
          <p
            style={{
              fontFamily: fontBody,
              fontSize: "var(--font-size-xs)",
              color: colors.primaryForeground,
              opacity: 0.85,
              margin: "var(--space-2) 0 0",
            }}
          >
            @
            {(cForm.name || "cliente")
              .toLowerCase()
              .replace(/\s+/g, "")
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "") || "cliente"}
          </p>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "var(--space-20) var(--space-24) var(--space-24)" }}>
        {clientProfileMenu.map((section) => (
          <ProfileSection key={section.title} title={section.title}>
            {section.items.map((item, i) => (
              <ProfileMenuRow
                key={item.label}
                icon={item.icon}
                label={item.label}
                last={i === section.items.length - 1}
                onClick={item.go ? () => setScreen(item.go) : undefined}
              />
            ))}
          </ProfileSection>
        ))}
        <button
          onClick={logout}
          style={{
            width: "100%",
            padding: "var(--space-13)",
            borderRadius: "var(--radius-xl)",
            border: `1px solid hsl(var(--destructive-hsl) / 0.3)`,
            background: "hsl(var(--destructive-hsl) / 0.06)",
            color: colors.destructiveText,
            fontWeight: 700,
            fontSize: "var(--font-size-sm)",
            fontFamily: fontBody,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "var(--space-8)",
          }}
        >
          <LogOut size={15} /> Sair da conta
        </button>
      </div>
      <BottomNav active="clientProfile" onNavigate={goToTab} />
    </div>
  );
}
