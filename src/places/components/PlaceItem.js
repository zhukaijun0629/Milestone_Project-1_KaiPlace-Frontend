import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import date from "date-and-time";
import ordinal from 'date-and-time/plugin/ordinal';
import day_of_week from 'date-and-time/plugin/day-of-week';


import Avatar from "../../shared/components/UIElements/Avatar";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";

import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import "./PlaceItem.css";

const PlaceItem = (props) => {
  date.plugin(ordinal);
  date.plugin(day_of_week);

  const pid = props.id;
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showMap, setShowMap] = useState(false);
  // const [showButton, setShowButton] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const openMapHandler = () => setShowMap(true);

  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    // console.log('DELETING...');
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/places/${pid}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      props.onDelete(pid);
    } catch (err) {}
  };

  // Future task: add a button to hide Edit and Delete buttons
  // const showButton = false;
  // let placeItemActions;
  // if (auth.userId === props.creatorId) {
  //   placeItemActions = (
  //     <div className="place-item__actions">
  //       <div className="place-item__actions-buttons">
  //         <Button to={`/places/${props.id}`}>EDIT</Button>

  //         <Button danger onClick={showDeleteWarningHandler}>
  //           DELETE
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={12} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img src={`${props.image}`} alt={props.description} />
          </div>
          <div className="place-item__info">
            {!window.location.pathname.includes(props.creatorId) &&
              props.creatorId && (
                // auth.userId !== props.creatorId &&
                <div className="place-item__creator-avatar">
                  <Link to={`/${props.creatorId}/places`}>
                    <Avatar
                      image={`${props.creatorImage}`}
                      alt={props.creatorName}
                    />
                  </Link>
                </div>
              )}
            <div className="place-item__place-info">
              <h3
                className="place-item__place-address"
                onClick={openMapHandler}
              >
                <>&#128205;</>
                {props.address}
              </h3>
              {props.creatorName && (
                <h3 className="place-item__creator-name">
                  <a href={`/${props.creatorId}/places`}>{props.creatorName}</a>
                </h3>
              )}
            </div>
          </div>
          <div className="place-item__place-desc">
            <p>{props.description}</p>
            <h3>
              {props.dateTakenAt &&
                date.format(new Date(props.dateTakenAt), "ddd, MMM DDD YYYY")}
            </h3>
          </div>
          <div className="place-item__place-edit">
            {auth.userId === props.creatorId && (
              <Link to={`/places/${props.id}`}>
                <>&#9998;</>
              </Link>
            )}
            {auth.userId === props.creatorId && (
              <p onClick={showDeleteWarningHandler}>
                <>&#128465;</>
              </p>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
