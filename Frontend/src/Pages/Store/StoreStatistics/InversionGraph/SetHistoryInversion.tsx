import { historyInversion } from "../../../../types";
import { useEffect, useState } from "react";
import BarGraphInversionHistory from "./BarGraphInversionHistory";

type Props = {
  historyInversion: historyInversion[];
};
const SetHistoryInversion: React.FC<Props> = ({ historyInversion }: Props) => {
  const [newLabels, setNewLabels] = useState<string[]>([]);
  const [newData, setNewData] = useState<number[]>([]);
  const [price, setPrice] = useState<number[]>([]);
  const [unit, setUnit] = useState<number[]>([]);
  useEffect(() => {
    setNewLabels(historyInversion.map((d) => `${d.data} \n${d.coin}`));
    setNewData(historyInversion.map((i) => i.inversion));
    setPrice(historyInversion.map((p) => p.price));
    setUnit(historyInversion.map((u) => u.unit));
  }, []);

  return (
    <BarGraphInversionHistory
      historyInversion={{
        newLabels: newLabels,
        newData: newData,
        price: price,
        unit: unit,
      }}
    />
  );
};
export default SetHistoryInversion;
