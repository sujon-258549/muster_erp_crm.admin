import type { ReactNode } from "react"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import { store, persistor } from "@/redux/store"
import LoadingPage from "@/pages/common/LoadingPage"

interface Props {
  children: ReactNode
}

export function ReduxProvider({ children }: Props) {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingPage />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}
