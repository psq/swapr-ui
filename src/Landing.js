import React, { } from 'react'

export default function Landing (props) {
  return (
    <div className="Landing">
      <div className="jumbotron jumbotron-fluid pt-3 mb-0">
        <div className="container">
          <div className="panel-landing text-center mt-3">
            <h1 className="landing-heading">swapr</h1>
            <p className="lead">
              Trustless token exchange on Blockstack
            </p>

            <p className="alert alert-info  border-info">
              swapr allows you to exchange tokens on the Blockstack platform
            </p>

            <div className="card mt-4 border-info">
              <div className="card-header">
                <h5 className="card-title">About Blockstack</h5>
              </div>
              <div className="row">
                <div className="col col-md-12 p-4">
                  <a
                    href="https://blockstack.org/about"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Blockstack PBC
                  </a>{' '}
                  is a New York based public benefit corporation, creating a
                  decentralized computing network and app ecosystem designed
                  to protect digital rights including privacy and
                  data&nbsp;ownership.
                </div>
              </div>
            </div>

            <div className="card mt-4 border-info">
              <div className="card-header">
                <h5 className="card-title">swapr</h5>
              </div>
              <div className="card-body">
                To check it out, sign in
              </div>

              <div className="card-footer text-info">
                <strong>
                  Coming soon to mainnet.
                </strong>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

