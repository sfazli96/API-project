import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotList from "./components/SpotList";
import SpotDetail from "./components/SpotDetail";
import UserReviewsPage from "./components/UserReviewsPage";
import UserSpotsPage from "./components/UserSpotsPage"
import { ThemeProvider } from 'react-hook-theme';
import Search from "./components/Search";
import Footer from "./components/Footer";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
    <ThemeProvider
    options={{
        theme: 'dark',
        save: true,
    }}
    >
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
          <Route path="/search">
            <Search />
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      )}
      </ThemeProvider>
    <Footer/>

    </>
  );
}

export default App;

function NotFound() {
  return (
    <div className="root-404-page" style={{ paddingTop: "100px", textAlign: "center", paddingBottom: "125px" }}>
      <h1 className="404-title-notFound">404 Not Found</h1>
      <p className="404-paragraph">Sorry, the page you are looking for doesn't exist.</p>
      <img src="https://media.tenor.com/IHdlTRsmcS4AAAAC/404.gif"></img>
    </div>
  )
}
