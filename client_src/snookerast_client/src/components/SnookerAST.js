import { Component } from "react";
import { Link } from 'react-router-dom';


class SnookerAST extends Component {
    render() {
        return (
            <div className="headerDiv">
                <h1 className="title">Snooker AST</h1>
                <div className="navDiv">
                    <nav>
                        <ul>
                            <li>
                                <Link className="link" to="/compare-players">Players</Link>
                            </li>
                            <li>
                                <Link className="link" to="/compare-tournaments">Tournaments</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </div>
        )
    }
}

export default SnookerAST;
