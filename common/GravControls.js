/* GravControls
 * heavily based off FlyControls by James Baicoianu / http://www.baicoianu.com/
 */
THREE.GravControls = function ( object ) {

    this.object = object;
	this.object.useQuaternion = true;
    this.movementSpeed = 5;
    this.rollSpeed = Math.PI / 3;
	this.dragToLook = false;
	this.autoForward = false;

	this.tmpQuaternion = new THREE.Quaternion();
	this.moveState = {
        up: 0, down: 0, left: 0, right: 0, forward: 0, back: 0,
        pitchUp: 0, pitchDown: 0, yawLeft: 0, yawRight: 0,
        rollLeft: 0, rollRight: 0
    };
	this.moveVector = new THREE.Vector3( 0, 0, 0 );
	this.rotationVector = new THREE.Vector3( 0, 0, 0 );
    // this.velocity = new THREE.Vector3( 0, 0, 0 );

    this.update = function( delta ) {

        this.moveState.forward = keyboard.pressed( "w" ) ? 1 : 0;
        this.moveState.back = keyboard.pressed( "s" ) ? 1 : 0;
        this.moveState.left = keyboard.pressed( "a" ) ? 1 : 0;
        this.moveState.right = keyboard.pressed( "d" ) ? 1 : 0;
        this.moveState.up = keyboard.pressed( "r" ) ? 1 : 0;
        this.moveState.down = keyboard.pressed( "f" ) ? 1 : 0;
        this.moveState.pitchUp = keyboard.pressed( "up" ) ? 1 : 0;
        this.moveState.pitchDown = keyboard.pressed( "down" ) ? 1 : 0;
        this.moveState.yawLeft = keyboard.pressed( "left" ) ? 1 : 0;
        this.moveState.yawRight = keyboard.pressed( "right" ) ? 1 : 0;
        this.moveState.rollLeft = keyboard.pressed( "q" ) ? 1 : 0;
        this.moveState.rollRight = keyboard.pressed( "e" ) ? 1 : 0;

        // update moveVector
        var moveMult = delta * this.movementSpeed;
        var rotMult = delta * this.rollSpeed;

        var forward = (
                this.moveState.forward || ( this.autoForward && !this.moveState.back )
                ) ? 1 : 0;
        this.moveVector.x = ( -this.moveState.left    + this.moveState.right );
        this.moveVector.y = ( -this.moveState.down    + this.moveState.up );
        this.moveVector.z = ( -forward + this.moveState.back );


        this.object.translateX( this.moveVector.x * moveMult );
        this.object.translateY( this.moveVector.y * moveMult );
        this.object.translateZ( this.moveVector.z * moveMult );

        // update rotationVector
        this.rotationVector.x = ( -this.moveState.pitchDown + this.moveState.pitchUp );
        this.rotationVector.y = ( -this.moveState.yawRight  + this.moveState.yawLeft );
        this.rotationVector.z = ( -this.moveState.rollRight + this.moveState.rollLeft );

        // perform update
        this.tmpQuaternion.set(
                this.rotationVector.x * rotMult,
                this.rotationVector.y * rotMult,
                this.rotationVector.z * rotMult, 1
                ).normalize();
        this.object.quaternion.multiply( this.tmpQuaternion );

        // expose the rotation vector for convenience
        this.object.rotation.setEulerFromQuaternion( this.object.quaternion, this.object.eulerOrder );
    };
};
