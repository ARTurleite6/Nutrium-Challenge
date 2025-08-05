import { MapPin, Search as SearchIcon } from "lucide-react";
import { useCallback, useState } from "react";
import Button from "./Button";
import Input from "./Input";
import { useTranslation } from "react-i18next";

type SearchParams = {
  searchTerm: string;
  location: string;
};

type Props = {
  onSearch: (params: SearchParams) => void;
};

const Search: React.FC<Props> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  const { t } = useTranslation();

  const handleSearch = useCallback((): void => {
    onSearch({ searchTerm, location });
  }, [onSearch, searchTerm, location]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch],
  );

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full mx-auto bg-gradient-to-br from-search-start to-search-end px-4 sm:px-6 lg:px-16 py-12">
      <div className="flex-1">
        <Input
          type="text"
          placeholder={t("search.placeholder.search")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyPress}
          variant="search"
          icon={<SearchIcon className="w-5 h-5 text-emerald-500" />}
          iconPosition="left"
        />
      </div>

      <div className="flex-1">
        <Input
          type="text"
          placeholder={t("search.placeholder.location")}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          onKeyDown={handleKeyPress}
          variant="search"
          icon={<MapPin className="w-5 h-5 text-emerald-500" />}
          iconPosition="right"
        />
      </div>

      <Button variant="orange" onClick={handleSearch}>
        {t("search.button")}
      </Button>
    </div>
  );
};

export default Search;
