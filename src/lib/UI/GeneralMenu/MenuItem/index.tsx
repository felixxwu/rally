import { Ref } from '../../../utils/ref';
import { SimpleMenuItem } from './SimpleMenuItem';
import { NumberMenuItem } from './NumberMenuItem';
import { CycleMenuItem } from './CycleMenuItem';
import { ToggleMenuItem } from './ToggleMenuItem';

export function MenuItem({
  selected,
  label,
  onHover,
  onChoose,
  cycleValueRef,
  cycleSet,
  numberRef,
  booleanRef,
}: {
  selected: boolean;
  label: string;
  onHover: () => void;
  onChoose?: () => void;
  cycleValueRef?: Ref<string>;
  cycleSet?: string[];
  numberRef?: Ref<number>;
  booleanRef?: Ref<boolean>;
}) {
  if (numberRef) {
    return (
      <NumberMenuItem selected={selected} label={label} onHover={onHover} numberRef={numberRef} />
    );
  }

  if (booleanRef) {
    return (
      <ToggleMenuItem selected={selected} label={label} onHover={onHover} boolRef={booleanRef} />
    );
  }

  if (cycleValueRef && cycleSet) {
    return (
      <CycleMenuItem
        selected={selected}
        label={label}
        onHover={onHover}
        valueRef={cycleValueRef}
        cycleSet={cycleSet}
      />
    );
  }

  return <SimpleMenuItem selected={selected} label={label} onHover={onHover} onChoose={onChoose} />;
}
