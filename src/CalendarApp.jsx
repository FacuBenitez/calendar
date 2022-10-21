import { AppRouter } from "./router";
import { BrowserRouter} from 'react-router-dom'
import { Provider } from "react-redux";
import { store } from "./store";


export const CalendarApp = (params) => {
  return(
      <Provider
        store={store}
      >
        <BrowserRouter>
          <AppRouter/>
        </BrowserRouter>

      </Provider>
         )
};
