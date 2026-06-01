export function Loading() {
  return <div className="card">Loading data...</div>;
}

export function ErrorView({ message }) {
  return <div className="card text-red-600">Error: {message}</div>;
}
