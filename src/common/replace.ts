export type Replace<OriginalType, ReplacedTypes> = Omit<
  OriginalType,
  keyof ReplacedTypes
> &
  ReplacedTypes;
