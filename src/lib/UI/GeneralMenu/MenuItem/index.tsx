import { Ref } from '../../../utils/ref';
import { SimpleMenuItem } from './SimpleMenuItem';
import { NumberMenuItem } from './NumberMenuItem';
import { CycleMenuItem } from './CycleMenuItem';

export function MenuItem({
  selected,
  label,
  onHover,
  onChoose,
  cycleValueRef,
  cycleSet,
  onCycleSelect,
  numberRef,
}: {
  selected: boolean;
  label: string;
  onHover: () => void;
  onChoose?: () => void;
  cycleValueRef?: Ref<string>;
  cycleSet?: string[];
  onCycleSelect?: (value: string) => void;
  numberRef?: Ref<number>;
}) {
  if (numberRef) {
    return (
      <NumberMenuItem selected={selected} label={label} onHover={onHover} numberRef={numberRef} />
    );
  }

  if (cycleValueRef && cycleSet && onCycleSelect) {
    return (
      <CycleMenuItem
        selected={selected}
        label={label}
        onHover={onHover}
        valueRef={cycleValueRef}
        cycleSet={cycleSet}
        onCycleSelect={onCycleSelect}
      />
    );
  }

  return <SimpleMenuItem selected={selected} label={label} onHover={onHover} onChoose={onChoose} />;
}
