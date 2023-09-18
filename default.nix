{ nixpkgs ? import <nixpkgs> {} }:

nixpkgs.stdenv.mkDerivation rec {
  name = "packages";
  LANG = "en_US.UTF-8";
  buildInputs = [
    nixpkgs.cloc
    nixpkgs.coreutils
    nixpkgs.docker-compose
    nixpkgs.gnumake42
    nixpkgs.gnused
    nixpkgs.jq
    nixpkgs.postgresql
    nixpkgs.yq-go
  ];
}
