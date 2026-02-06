CREATE DATABASE `NYTreeFilter`;
use NYTreeFilter;
CREATE TABLE if not exists Trees(
	TreeId INT NOT Null,
    species varchar(255),
    CommonName varchar (255),
    AGCT enum('Uncertain','Very Poor', 'Poor', 'Fair', 'Good', 'Very Good'),
    ACProd enum('Uncertain','Very Poor', 'Poor', 'Fair', 'Good', 'Very Good'),
	NWIStatus enum('Uncertain','OBL', 'FACW', 'FAC', 'FACU', 'UPL')
);
create table if not exists LandformPref(
	TreeID INT NOT Null,
    FloodPlainBottomLand boolean,
    UPlandMesic boolean,
    UplandDry boolean,
    foreign key (TreeId) references Trees (TreeId)
);
create table if not exists SiteChemPref(
	TreeID INT NOT Null,
    SoilAcidTol boolean,
    SoilAlkainTol boolean,
    SaltTol boolean,
    foreign key (TreeId) references Trees (TreeId)
);
create table if not exists Ecoregion(
	TreeID INT NOT Null,
    EasternGreatLakeLowLands boolean,
    NorthernAlleghenyPlateau boolean,
    ErieDriftPlain boolean,
    NorthernCoastalZone boolean,
    NorthernPiedmont boolean,
    RidgeAndValley boolean,
    AtlanticCoastalPineBarrens boolean,
    NortheasternHighlands boolean,
    NorthCentralAppalachian boolean,
    foreign key (TreeId) references Trees (TreeId)
);
create table if not exists SAFForestTypeGroup(
	TreeID INT NOT Null,
    AspenBirch boolean,
    ElmAshCottonwood boolean,
    LoblollyShortleafPine boolean,
    MapleBeechBirch boolean,
    OakHickory boolean,
    SpruceFir boolean,
    WhiteRedJackPine boolean,
    foreign key (TreeId) references Trees (TreeId)
);
create table if not exists SpeciesCharacteristics(
	TreeID INT NOT Null,
    LifeSpane Int,
    TreeHeight Int,
    CanopySpread Int,
    GrowthRate enum('Slow','Moderate','Radpid'),
    ShadeTol enum('Low', 'Imtermidiate', 'High'),
    foreign key (TreeId) references Trees (TreeId)
);
create table if not exists EconomicValue(
	TreeID INT NOT Null,
    Edible boolean,
    Lumber boolean,
    FuelWood boolean,
    foreign key (TreeId) references Trees (TreeId)
);
create table if not exists EcologicalValue(
	TreeID INT NOT Null,
    KnownInteractions Int,
    AttractsPollinators boolean,
    AttractsBirds boolean,
    foreign key (TreeId) references Trees (TreeId)
);
create table if not exists PlantingConsiderations(
	TreeID INT NOT Null,
    RecomendedForWindbreak boolean,
    DeerResistance enum('Very Low','Low','Intermidiate','High','Very High'),
    PestAndPathogenSusceptibility enum('Very Low','Low','Intermidiate','High','Very High'),
    foreign key (TreeId) references Trees (TreeId)
);
