export interface AuthContextType {
  isAuthenticated: boolean;
  openAuthModal: () => void;
  logout: () => void;
}
