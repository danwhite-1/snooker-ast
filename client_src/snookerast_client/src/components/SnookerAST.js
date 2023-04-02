import { Component } from "react";
import { Link } from 'react-router-dom';


class SnookerAST extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <h1 className='title'>Snooker AST</h1>
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
        )
    }
}

export default SnookerAST;
