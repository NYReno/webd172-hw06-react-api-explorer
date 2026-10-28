function UserCard({ name, email, phone, dist }) {
  return (
    <article className="user-card">
      <h2>{name}</h2>
      <p>Email: {email}</p>
      <p> Phone: {phone}</p>
      <p> distance: {dist} km</p>
    </article>
  );
}

export default UserCard;
