{
  inputs = {
    nixpkgs.url =
      "github:nixos/nixpkgs";
    flake-utils.url =
      "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.simpleFlake {
      inherit self nixpkgs;
      name = "Package name";
      shell = { pkgs }:
        pkgs.mkShell {
          buildInputs = with pkgs; [ nodejs yarn ];
          shellHook = ''
            export PATH="$(pwd)/node_modules/.bin:$PATH"
          '';
        };

    };
}
