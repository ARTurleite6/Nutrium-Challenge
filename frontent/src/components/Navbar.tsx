import { useLocation } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const { t } = useTranslation();

  const nutritionistsRoute = "/pending_appointments";
  const showSpecialContent = !currentPath.startsWith(nutritionistsRoute);

  return (
    <div className="w-full bg-gradient-to-br from-navbar-start to-navbar-end px-16 py-4">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-sm flex items-center justify-center">
            <span className="text-emerald-400 text-xl font-bold">♥</span>
          </div>
          <span className="text-white text-xl font-semibold">nutrium</span>
        </div>

        <div className="flex items-center space-x-6">
          {showSpecialContent && (
            <div className="hidden lg:flex items-center text-white text-sm">
              <span className="mr-2">{t("navbar.cta")}</span>
              <span className="text-lg">→</span>
            </div>
          )}
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
