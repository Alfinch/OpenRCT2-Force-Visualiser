export function getTrain(zeroCarId: number): Car[] {
  const train: Car[] = [];
  let carId: number | null = zeroCarId;
  do {
    const car = map.getEntity(carId) as Car;
    train.push(car);
    carId = car.nextCarOnTrain;
  } while (carId != null);
  return train;
}
