import React,{ useContext } from 'react';

import UserItem from './UserItem';
import Card from '../../shared/components/UIElements/Card';
import './UsersList.css';
import { AuthContext } from "../../shared/context/auth-context";


const UsersList = props => {
  const auth = useContext(AuthContext);

  if (props.items.length === 0) {
    return (
      <div className="center">
        <Card>
          <h2>No users found.</h2>
        </Card>
      </div>
    );
  }

  const loggedInUser = props.items.find(user => user.id === auth.userId)

  return (
    <ul className="users-list">
      {loggedInUser && (
        <UserItem
          key={loggedInUser.id}
          id={loggedInUser.id}
          image={loggedInUser.image}
          name={loggedInUser.name}
          placeCount={loggedInUser.places.length}
        />
      )}
      {props.items.map(user => user.id !== auth.userId && (
        <UserItem
          key={user.id}
          id={user.id}
          image={user.image}
          name={user.name}
          placeCount={user.places.length}
        />
      ))}
    </ul>
  );
};

export default UsersList;
