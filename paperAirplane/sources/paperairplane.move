module paperairplane::paperairplane;
    use std::string::String;
    use std::vector;
    use sui::{
        display,
        package,
        event::{emit},
    };
    use paperairplane::utils::{to_b36};

    /*-------错误码-------*/
    const ENOT_OWNER :u64 = 0;
    const EOVERSIZE :u64 = 1;

    const VISUALIZATION_SITE:address = @0x1;
    const MAX_SIZE :u64 = 3;

    /*-----事件------*/
    public struct CreatedAirplaneEvent has copy, drop {
        event_id: ID,
        name: String,
        b36addr:String
    }

    /*------结构体------*/
    public struct Airplane has key{
        id: UID,
        name: String,
        content: String,
        owner:address,
        blobs:vector<String>,
        b36addr:String
    }

    public struct Airport has key,store{
        id:UID,
        airplanes:vector<address>
    }

    public struct PAPERAIRPLANE has drop{}

    fun init(otw:PAPERAIRPLANE,ctx:&mut TxContext){
        let publisher = package::claim(otw,ctx);
        let mut site_display = display::new<Airplane>(&publisher,ctx);

        site_display.add(
            b"link".to_string(),
            b"https://{b36addr}.walrus.site".to_string(),
        );

        site_display.add(
            b"walrus site address".to_string(),
            VISUALIZATION_SITE.to_string(),
        );

        site_display.update_version();


        let airport = Airport{
            id: object::new(ctx),
            airplanes: vector::empty()
        };

        transfer::public_share_object(airport);
       transfer::public_transfer(publisher,ctx.sender());
       transfer::public_transfer(site_display,ctx.sender());
    }

    public entry fun create_airplane(airport:&mut Airport,name: String, content: String, blobs:vector<String>, ctx: &mut TxContext) {
       
        assert!(vector::length(&blobs) < MAX_SIZE, EOVERSIZE);
        
        let sender = ctx.sender();
        let id = object::new(ctx);
        let object_address = object::uid_to_address(&id);
        let b36addr = to_b36(object_address);
        let event_id = id.to_inner();


        let mut airplane = Airplane {
            id,
            name,
            content: content,
            owner: sender,
            b36addr: b36addr,
            blobs:vector::empty()
        };

        vector::push_back(&mut airport.airplanes,object_address);
        vector::append(&mut airplane.blobs,blobs);

        transfer::share_object(airplane);

        emit(CreatedAirplaneEvent {
            event_id,
            name:name,
            b36addr: b36addr
        });
    }


