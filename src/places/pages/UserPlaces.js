import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

import UserItem from "../../user/components/UserItem";
import PlaceList from "../components/PlaceList";
import "./UserPlaces.css";

const UserPlaces = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = useParams().userId;
  const [loadedPlaces, setLoadedPlaces] = useState();
  const [loadedUser, setLoadedUser] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/users/${userId}`
        );
        setLoadedUser(responseData.user);
      } catch (err) {}
    };
    fetchUser();
  }, [sendRequest, userId]);

  useEffect(() => {
    const fetchPlacesByUserId = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
        );
        setLoadedPlaces(responseData.places);
      } catch (err) {
        setLoadedPlaces([]);
      }
    };
    fetchPlacesByUserId();
  }, [sendRequest, userId]);

  console.log(loadedPlaces);

  const placeDeletedHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      <div className="user-places-sub-header">
      {!isLoading && loadedUser && (
        <UserItem
        key={loadedUser.id}
        id={loadedUser.id}
        image={loadedUser.image}
        name={loadedUser.name}
        placeCount={loadedUser.places.length}
      />
      )}
      </div>
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />
      )}
    </React.Fragment>
  );
};

export default UserPlaces;
