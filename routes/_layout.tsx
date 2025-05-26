import { PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { OWNER } from "../utils/config.ts";

export default function Layout({ Component }: PageProps) {
  return (
    <>
      <Head>
        <title>El Blog de {OWNER}</title>
        <meta
          name="description"
          content="Un blog moderno sobre tecnología y desarrollo"
        />
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <header className="header">
        <div className="container">
          <div className="logo">
            <a href="/">El Blog de {OWNER}</a> {/*Cambiado de # a / el link*/}
          </div>
          <nav className="nav">
            <a href="/" className="nav-link">Inicio</a> {/*Cambiado de # a / el link*/}
            <a href="/search/" className="nav-link">Buscar</a> {/*Cambiado de # a /search el link*/}
            <a href="/create/" className="nav-link">Crear</a> {/*Cambiado de # a /create el link*/}
          </nav>
        </div>
      </header>

      <main className="main-content">
        <Component />
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Sobre el Blog</h3>
              <p>
                Un espacio para compartir conocimientos sobre tecnología,
                programación y desarrollo web.
              </p>
            </div>
            <div className="footer-section">
              <h3>Enlaces Rápidos</h3>
              <ul>
                <li>
                  <a href="/">Inicio</a> {/*Cambiado de # a / el link*/}
                </li>
                <li>
                  <a href="/search/">Buscar</a> {/*Cambiado de # a /search el link*/}
                </li>
                <li>
                  <a href="/create/">Crear</a> {/*Cambiado de # a /create el link*/}
                </li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>
              &copy; {new Date().getFullYear()} El Blog de{" "}
              {OWNER}. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
