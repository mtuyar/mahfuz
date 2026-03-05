interface MeccaSvgProps {
  className?: string;
}

export function MeccaSvg({ className }: MeccaSvgProps) {
  return (
    <img
      src="/images/kaaba.png"
      alt=""
      aria-hidden="true"
      className={className}
      draggable={false}
    />
  );
}
