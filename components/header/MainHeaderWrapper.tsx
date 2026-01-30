import { HeaderVisibilityProvider } from "./HeaderVisibility";
import MainHeader from "./MainHeader";

export default function MainHeaderWrapper() {
  return (
    <HeaderVisibilityProvider>
      <MainHeader />
    </HeaderVisibilityProvider>
  );
}
