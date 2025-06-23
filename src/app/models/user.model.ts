export interface UserProfile {
  id?: number;
  username?: string;
  nombre?: string;
  apellido?: string;
  educacion?: string;
  fechaNacimiento?: Date | null;
  lat?: number | null;
  lng?: number | null;
  profileImageUrl?: string;
}