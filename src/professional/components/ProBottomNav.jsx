// Barra de navegação inferior do profissional (usa NavBar compartilhado) · API: nenhuma
import { NavBar } from "../../shared/components/NavBar";
import { proBottomNavItems } from "../data/navigation";

export const ProBottomNav = (props) => <NavBar items={proBottomNavItems} {...props} />;
