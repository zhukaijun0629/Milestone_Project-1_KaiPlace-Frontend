import React, {useContext} from 'react';
import { useParams } from "react-router-dom";


import Card from '../../shared/components/UIElements/Card';
import PlaceItem from './PlaceItem';
import Button from '../../shared/components/FormElements/Button';
import { AuthContext } from "../../shared/context/auth-context";
import './PlaceList.css';

const PlaceList = props => {
  const auth = useContext(AuthContext);
  const userId = useParams().userId;
  if (props.items.length === 0 && auth.userId === userId) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No places found. Maybe create one?</h2>
          <Button to="/places/new">Share Place</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {props.items.map(place => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.image}
          // title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creator.id || place.creator}
          creatorImage={place.creator.image}
          creatorName={place.creator.name}
          coordinates={place.location}
          dateTakenAt={place.dateTakenAt}
          onDelete={props.onDeletePlace}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
