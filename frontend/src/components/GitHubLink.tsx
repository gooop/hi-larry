import GitHubLogo from '../../assets/GitHub_Invertocat_Black.svg';

export default function GitHubLink() {
  const handleClick = () => {
    window.open(
      'https://github.com/gooop/hi-larry',
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <a
      href="https://github.com/gooop/hi-larry"
      onClick={(e) => {
        e.preventDefault();
        handleClick();
      }}
      aria-label="GitHub"
      className="github-link"
    >
      <img src={GitHubLogo} alt="GitHub Invertocat Logo" />
    </a>
  );
}
