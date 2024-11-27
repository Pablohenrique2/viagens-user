import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  KeyboardEvent,
} from "react";
import axios from "axios";

interface Suggestion {
  properties: {
    name?: string;
    locality?: string;
    city?: string;
    state?: string;
  };
}

type Location = {
  fullName: string;
  display_name: string;
  [key: string]: any;
};

interface AutocompleteInputProps {
  placeholder: string;
  onSelect: (selectedValue: Location) => void;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  placeholder,
  onSelect,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const suggestionsRef = useRef<HTMLUListElement | null>(null);
  const inputRef = useRef<HTMLDivElement | null>(null);

  const fetchSuggestions = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get("https://photon.komoot.io/api/", {
        params: {
          q: query,
          lang: "en",
          limit: 5,
        },
      });

      setSuggestions(response.data.features || []);
    } catch (error) {
      console.error("Erro ao buscar sugestões:", error);
      setSuggestions([]);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    fetchSuggestions(value);
  };

  const formatFullName = (suggestion: Suggestion): string => {
    const { name, locality, city, state } = suggestion.properties;
    return [name, locality, city, state].filter(Boolean).join(", ");
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    const fullName = formatFullName(suggestion);

    console.log("Sugestão selecionada:", fullName);
    setInputValue(fullName);
    setSuggestions([]);

    const location: Location = {
      fullName: fullName,
      display_name: fullName,
    };

    onSelect(location);
  };

  const handleInputBlur = () => {
    if (
      inputValue &&
      !suggestions.some((s) => formatFullName(s) === inputValue)
    ) {
      const location: Location = {
        fullName: inputValue,
        display_name: inputValue,
      };
      onSelect(location);
    } else {
      const location: Location = {
        fullName: inputValue,
        display_name: inputValue,
      };
      onSelect(location);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleInputBlur();
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      inputRef.current &&
      !inputRef.current.contains(e.target as Node) &&
      suggestionsRef.current &&
      !suggestionsRef.current.contains(e.target as Node)
    ) {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={inputRef}>
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 bg-[#f3f3f3] focus:ring-blue-400"
      />
      {suggestions.length > 0 && (
        <ul
          ref={suggestionsRef}
          className="absolute left-0 right-0 bg-white border rounded-md mt-1 max-h-40 overflow-y-auto shadow-md z-10"
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="p-2 hover:bg-blue-100 cursor-pointer"
            >
              {formatFullName(suggestion)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteInput;
