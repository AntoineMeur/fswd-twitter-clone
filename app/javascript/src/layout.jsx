
import React from 'react';

const Layout = (props) => {
  return (
    <React.Fragment>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand text-light" href="/">Twitter</a>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className="nav-link" href="/"></a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      {props.children}
          </React.Fragment>
  );
}

export default Layout;