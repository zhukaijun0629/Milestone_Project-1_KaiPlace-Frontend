import React, { useContext } from "react";
import { Link } from "react-router-dom";

import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import "./UserItem.css";
import { AuthContext } from "../../shared/context/auth-context";

const UserItem = (props) => {
  const auth = useContext(AuthContext);

  return (
    <li className="user-item">
      <Card className="user-item__content">
        <Link to={`/${props.id}/places`}>
          <div className="user-item__image">
            <Avatar image={`${props.image}`} alt={props.name} />
          </div>
          <div className="user-item__info">
            <h2>{props.name}</h2>
            <h3>
              {props.placeCount} {props.placeCount === 1 ? "Place" : "Places"}
            </h3>
          </div>
        </Link>
        <div className="user-item__edit-btn">
          {auth.userId === props.id && (
            <Button to={`/${props.id}/update`}>EDIT</Button>
          )}
        </div>
      </Card>
    </li>
  );
};

export default UserItem;
