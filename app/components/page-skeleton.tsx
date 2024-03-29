export function PageSkeleton({
  header,
  description,
  actionsSlot,
  children,
}: {
  header: React.ReactNode;
  description: React.ReactNode;
  actionsSlot?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between border-b border-t border-gray-200 bg-white px-6 py-6 dark:border-white/5 dark:bg-inherit">
        <div>
          <h1 className="text-2xl font-semibold leading-10 text-gray-700 dark:text-gray-100">
            {header}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-300">
            {description}
          </p>
        </div>
        {actionsSlot ? <div>{actionsSlot}</div> : null}
      </div>
      <div className="px-6">{children}</div>
    </div>
  );
}
