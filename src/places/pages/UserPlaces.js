import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

import UserItem from "../../user/components/UserItem";
import PlaceList from "../components/PlaceList";
import "./UserPlaces.css";
import Button from "../../shared/components/FormElements/Button";

const UserPlaces = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = useParams().userId;
  const [isStoryMode, setIsStoryMode] = useState(false);
  const [timeDir, setTimeDir] = useState(false);
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

  // console.log(loadedPlaces);

  const switchModeHandler = () => {
    if (!isStoryMode) {
      if (timeDir) {
        loadedPlaces.sort((a, b) => (a.dateTakenAt < b.dateTakenAt ? 1 : -1));
      } else {
        loadedPlaces.sort((a, b) => (a.dateTakenAt > b.dateTakenAt ? 1 : -1));
      }
    } else {
      loadedPlaces.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      setTimeDir(false);
    }
    // console.log(event.target.innerHTML);

    setIsStoryMode((prevMode) => !prevMode);
  };

  const switchDirHandler = () => {
    loadedPlaces.reverse();
    setTimeDir((prevMode) => !prevMode);
  };

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
        <ul className="nav-links user-places-sub-header-btns">
          <li className="user-places-sub-header-btns-story">
            {!isLoading &&
              loadedUser &&
              loadedPlaces &&
              loadedPlaces.length > 1 && (
                <Button
                  noHover={isStoryMode}
                  inverse={!isStoryMode}
                  onClick={switchModeHandler}
                >
                  STORY MODE
                </Button>
              )}
            {!isLoading && loadedUser && isStoryMode && (
              <Button
                noHover={!timeDir}
                inverse={timeDir}
                onClick={switchDirHandler}
              >
                {timeDir ? (<>&#9195;</>) : (<>&#9196;</>)}
              </Button>
            )}
          </li>
        </ul>
      </div>
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />
      )}
    </React.Fragment>
  );
};

export default UserPlaces;
