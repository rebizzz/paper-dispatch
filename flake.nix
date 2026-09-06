{
  description = "Paper Dispatch - Elegant editorial publishing platform";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
  };

  outputs = {
    self,
    nixpkgs,
  }: let
    systems = ["x86_64-linux" "aarch64-linux" "x86_64-darwin" "aarch64-darwin"];
    forEachSystem = f: nixpkgs.lib.genAttrs systems (system: f nixpkgs.legacyPackages.${system});
  in {
    devShells = forEachSystem (pkgs: {
      default = pkgs.mkShell {
        packages = with pkgs; [
          bun
          nodejs_22
          gh
          git
        ];
      };
    });

    formatter = forEachSystem (pkgs: pkgs.alejandra);
  };
}
