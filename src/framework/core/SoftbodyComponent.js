import {$wrap} from '../utils/ComponentUtils';

function SoftbodyComponent(target) {
  Object.assign(target.defaults, {
    softbody: false
  });

  Object.assign(target.prototype, {
    proccessSoftbodyGeometry(geometry) {
      const _params = this.params;

      geometry.rotateX(_params.rotation.x);
      geometry.rotateY(_params.rotation.y);
      geometry.rotateZ(_params.rotation.z);

      geometry.scale(
        _params.scale.x,
        _params.scale.y,
        _params.scale.z
      );

      geometry.translate(
        _params.position.x,
        _params.position.y,
        _params.position.z
      );
    },

    copy(source) {
      const sourceNative = source.native;

      if (sourceNative) {
        if (source.params.softbody)
          this.native = new sourceNative.constructor(sourceNative.tempGeometry.clone(), sourceNative.material, source.params);
        else this.native = sourceNative.clone(source.params);

        this.native.mass = sourceNative.mass;
        this.params = Object.create(source.params);

        this.wrap('no-transforms');

        this.position.copy(source.position);
        this.rotation.copy(source.rotation);
        this.quaternion.copy(source.quaternion);
      } else this.params = source.params;

      this.callCopy(this);

      return this;
    },

    wrapTransforms() {
      const _params = this.params;

      if (!_params.softbody) {
        const position = _params.position,
          rotation = _params.rotation,
          scale = _params.scale;

        this.position.set(
          position.x,
          position.y,
          position.z
        );

        this.rotation.set(
          rotation.x,
          rotation.y,
          rotation.z
        );

        this.scale.set(
          scale.x,
          scale.y,
          scale.z
        );
      }
    }
  });

  $wrap(target).onCallAddTo(scope => {
    if (scope.params.softbody) {
      scope.native.position.set(0, 0, 0);
      scope.native.rotation.set(0, 0, 0);
    }
  });
}

export {
  SoftbodyComponent
};
