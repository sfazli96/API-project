import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotList from "./components/SpotList";
import SpotDetail from "./components/SpotDetail";
import UserReviewsPage from "./components/UserReviewsPage";
import UserSpotsPage from "./components/UserSpotsPage"
function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path={["/"]}
          exact >
            <SpotList />
          </Route>
          <Route path={["/spots/:spotId"]}
          exact >
            <SpotDetail />
          </Route>
          <Route path="/myReviews" component={UserReviewsPage} />
          <Route path="/mySpots">
            <UserSpotsPage />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
