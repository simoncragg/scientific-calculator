import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "./store";
import { calcSlice } from "./calcSlice";

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useCalcActions = () => calcSlice.actions;
