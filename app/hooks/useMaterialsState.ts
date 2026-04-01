import { useCallback } from "react";
import { Materials } from "../types";
import { useLocalStorage } from "./useLocalStorage";

const defaultMaterials: Materials = {
  restaurant: "",
  location: "",
  dishes: "",
  notes: "",
};

export function useMaterialsState() {
  const [materials, setMaterials] = useLocalStorage<Materials>(
    "momopi_materials",
    defaultMaterials
  );

  // Update a single material field
  const handleMaterialChange = useCallback(
    (field: keyof Materials, value: string) => {
      setMaterials((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  // Reset all materials
  const resetMaterials = useCallback(() => {
    setMaterials(defaultMaterials);
  }, []);

  return {
    materials,
    setMaterials,
    handleMaterialChange,
    resetMaterials,
  };
}
