// src/components/Search.tsx
import React, { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";

interface PropsSearch {
  handleSubmit: (searchTerm: string) => void;
  label: string
}

export const Search: React.FC<PropsSearch> = ({ handleSubmit, label }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSubmit(searchTerm.trim());
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      handleSubmit(value.trim());
    }, 500); // 500ms debounce
  };

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  return (
    <form onSubmit={onSubmit} className="flex">
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder={label}
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </form>
  );
};

export default Search;
