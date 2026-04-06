export default function NoticeCard({ data }) {
  return (
    <div className="notice-card">
      <h4>{data.title}</h4>
      <p>{data.message}</p>
    </div>
  );
}