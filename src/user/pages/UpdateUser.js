import React, { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import {
  VALIDATOR_CFMPASSWD,
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./Auth.css";

const UpdateUser = () => {
  const auth = useContext(AuthContext);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUser, setLoadedUser] = useState();
  const userId = useParams().userId;
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      name: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`
        );
        setLoadedUser(responseData.user);

        setFormData(
          {
            email: {
              value: responseData.user.email,
              isValid: true,
              setDiabled: true,
            },
            name: {
              value: responseData.user.name,
              isValid: true,
            },
            image: {
              value: responseData.user.image,
              isValid: true,
            },
          },
          true
        );
      } catch (error) {}
    };
    fetchUser();
  }, [sendRequest, userId, setFormData]);

  const switchModeHandler = () => {
    if (isChangePassword) {
      setFormData(
        {
          ...formState.inputs,
          old_password: undefined,
          new_password: undefined,
          password_confirm: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.name.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          old_password: {
            value: "",
            isValid: false,
          },
          new_password: {
            value: "",
            isValid: false,
          },
          password_confirm: {
            value: "",
            isValid: false,
          },
          image: {
            value: loadedUser.image || null,
            isValid: loadedUser ? true : false,
          },
        },
        false
      );
    }
    setIsChangePassword((prevMode) => !prevMode);
  };

  const updateSubmitHandler = async (event) => {
    event.preventDefault();

    if (auth.isLoggedIn && isChangePassword) {
      try {
        const formData = new FormData();
        formData.append("name", formState.inputs.name.value);
        formData.append("image", formState.inputs.image.value);
        formData.append("isChangePassword", true);
        formData.append("old_password", formState.inputs.old_password.value);
        formData.append("new_password", formState.inputs.new_password.value);

        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/users/${userId}`,
          "PATCH",
          formData
        );

        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    } else if (auth.isLoggedIn && !isChangePassword) {
      try {
        const formData = new FormData();
        formData.append("name", formState.inputs.name.value);
        formData.append("image", formState.inputs.image.value);
        formData.append("isChangePassword", false);
        formData.append("old_password", "XXXXXX");
        formData.append("new_password", "XXXXXX");

        const responseData = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + `/users/${userId}`,
          "PATCH",
          formData
        );

        auth.login(responseData.userId, responseData.token);
      } catch (err) {}
    }

    history.push("/" + auth.userId + "/places");
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedUser && (
        <Card className="authentication">
          {isLoading && <LoadingSpinner asOverlay />}
          <h2>Update User Info</h2>
          <hr />
          <Button inverse onClick={switchModeHandler}>
            {isChangePassword ? "KEEP" : "CHANGE"} PASSWORD
          </Button>
          <form onSubmit={updateSubmitHandler}>
            <Input
              element="input"
              id="email"
              type="email"
              label="E-Mail"
              validators={[VALIDATOR_EMAIL()]}
              errorText="Please enter a valid email address."
              onInput={inputHandler}
              initialValue={loadedUser.email}
              initialValid={true}
              disabled="disabled"
            />

            {isChangePassword && (
              <Input
                element="input"
                id="old_password"
                type="password"
                label="Old Password"
                validators={[VALIDATOR_MINLENGTH(6)]}
                errorText="Please enter a valid password, at least 6 characters."
                onInput={inputHandler}
              />
            )}
            {isChangePassword && (
              <Input
                element="input"
                id="new_password"
                type="password"
                label="New Password"
                validators={[VALIDATOR_MINLENGTH(6)]}
                errorText="Please enter a valid password, at least 6 characters."
                onInput={inputHandler}
              />
            )}
            {isChangePassword && (
              <Input
                element="input"
                id="password_confirm"
                type="password"
                label="Confirm New Password"
                validators={[
                  VALIDATOR_CFMPASSWD(formState.inputs.new_password.value),
                ]}
                errorText="Please verify your passwords."
                onInput={inputHandler}
              />
            )}
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
              initialValue={loadedUser.name}
              initialValid={true}
            />
            <ImageUpload
              center
              id="image"
              onInput={inputHandler}
              errorText="Please provide an image."
              initialValue={loadedUser.image}
              initialValid={true}
            />

            <Button type="submit" disabled={!formState.isValid}>
              UPDATE
            </Button>
          </form>
        </Card>
      )}
    </React.Fragment>
  );
};

export default UpdateUser;
