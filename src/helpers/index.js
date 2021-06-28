const helpers = {
    calculateBendAngle: (objects) => {
        let leftMomentum = 0, rightMomentum = 0, bending = 0;
        if (objects.length > 1) {
            objects.forEach(e => {
                if (e.position === 'left') {
                    leftMomentum += (5 - e.posx) * e.weight
                } else if (e.position === 'right') {
                    rightMomentum += (1 + e.posx) * e.weight
                } else {
                    return 'Wrong position!'
                }
            });
        } else return {
            bending,
            leftMomentum,
            rightMomentum
        }

        if (leftMomentum > rightMomentum) {
            bending = ((leftMomentum - rightMomentum) / (leftMomentum * 2.2)) * -100
        } else if (leftMomentum < rightMomentum) {
            bending = ((rightMomentum - leftMomentum) / (rightMomentum * 2.2)) * 100
        }

        return {
            bending,
            leftMomentum,
            rightMomentum
        }

    }
}

export default helpers;