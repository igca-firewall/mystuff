import GameCard from "./GameCard";

const FeaturedGames = () => {
  const games = [
    { title: "Cyberpunk 2077", image: "/images/cyberpunk.jpg" },
    { title: "The Witcher 3", image: "/images/OutThere.png" },
    { title: "Call of Duty", image: "/images/cod.jpg" },
  ];

  return (
    <section className="py-16 bg-light">
      <h2 className="text-4xl text-center font-bold text-dark mb-8">Featured Games</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-8">
        {games.map((game) => (
          <GameCard key={game.title} title={game.title} image={game.image} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedGames;
