import { GearFill, PauseFill, StarFill, TrashFill } from "react-bootstrap-icons";

export function Footer(): JSX.Element {
    return (
        <footer>
            <div className="buttons">
                <button>
                    <GearFill />
                </button>
                <button>
                    <PauseFill />
                </button>
                <button>
                    <StarFill />
                </button>
            </div>
            <div className="title"></div>
            <div className="buttons">
                <button>
                    <TrashFill />
                </button>
            </div>
        </footer>
    );
}
