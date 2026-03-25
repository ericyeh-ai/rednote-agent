import { Materials } from "../types";
import { PanelHeader } from "./shared/PanelHeader";
import { NoteField } from "./shared/NoteField";

export function MaterialsPanel({
  materials,
  onChange,
}: {
  materials: Materials;
  onChange: (field: keyof Materials, value: string) => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <PanelHeader icon="📋" title="素材" subtitle="隨手記下餐廳資訊" />

      <div className="flex flex-1 flex-col gap-5 overflow-y-auto pt-1 pr-1">
        <NoteField
          icon="🍽️"
          label="餐廳名稱"
          placeholder="e.g. 鼎泰豐 信義店"
          value={materials.restaurant}
          onChange={(v) => onChange("restaurant", v)}
        />
        <NoteField
          icon="📍"
          label="地點"
          placeholder="e.g. 台北市信義區"
          value={materials.location}
          onChange={(v) => onChange("location", v)}
        />
        <NoteField
          icon="🥢"
          label="推薦菜色"
          placeholder="e.g. 小籠包、蝦仁炒飯"
          value={materials.dishes}
          onChange={(v) => onChange("dishes", v)}
        />
        <NoteField
          icon="✏️"
          label="原始筆記"
          placeholder="隨意記下感受、細節、亮點⋯"
          value={materials.notes}
          onChange={(v) => onChange("notes", v)}
          multiline
        />

        <div className="rounded-xl border border-dashed border-zinc-200 p-3 text-center text-xs text-zinc-400 hover:border-zinc-300 cursor-pointer transition select-none">
          + 新增欄位
        </div>
      </div>
    </div>
  );
}